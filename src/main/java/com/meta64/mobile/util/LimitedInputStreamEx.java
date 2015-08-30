package com.meta64.mobile.util;

import java.io.IOException;
import java.io.InputStream;

import org.apache.commons.fileupload.util.LimitedInputStream;

public class LimitedInputStreamEx extends LimitedInputStream {

	public LimitedInputStreamEx(InputStream pIn, long pSizeMax) {
		super(pIn, pSizeMax);
	}

	@Override
	protected void raiseError(long pSizeMax, long pCount) throws IOException {
		throw new IOException("stream to large.");
	}
}